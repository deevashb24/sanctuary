use anchor_lang::prelude::*;

declare_id!("SanctuaryVault11111111111111111111111111111");

#[program]
pub mod sanctuary_vault {
    use super::*;

    pub fn initialize_session(ctx: Context<InitializeSession>, amount: u64, duration_minutes: u64) -> Result<()> {
        let session = &mut ctx.accounts.session;
        session.user = ctx.accounts.user.key();
        session.amount = amount;
        session.start_time = Clock::get()?.unix_timestamp;
        session.duration_seconds = (duration_minutes * 60) as i64;
        session.is_active = true;

        // Transfer SOL from user to the PDA escrow
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn reclaim_session(ctx: Context<ReclaimSession>) -> Result<()> {
        let session = &mut ctx.accounts.session;
        require!(session.is_active, ErrorCode::SessionInactive);
        require!(session.user == ctx.accounts.user.key(), ErrorCode::Unauthorized);

        let current_time = Clock::get()?.unix_timestamp;
        let end_time = session.start_time + session.duration_seconds;
        require!(current_time >= end_time, ErrorCode::SessionNotFinished);

        session.is_active = false;

        // Transfer SOL from vault back to user
        let amount = session.amount;
        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }

    pub fn slash_session(ctx: Context<SlashSession>) -> Result<()> {
        let session = &mut ctx.accounts.session;
        require!(session.is_active, ErrorCode::SessionInactive);

        session.is_active = false;

        // Transfer SOL from vault to treasury
        let amount = session.amount;
        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeSession<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"session", user.key().as_ref()],
        bump
    )]
    pub session: Account<'info, FocusSession>,
    
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: PDA that holds the staked SOL
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReclaimSession<'info> {
    #[account(
        mut,
        seeds = [b"session", user.key().as_ref()],
        bump
    )]
    pub session: Account<'info, FocusSession>,
    
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: PDA that holds the staked SOL
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SlashSession<'info> {
    #[account(
        mut,
        seeds = [b"session", user.key().as_ref()],
        bump
    )]
    pub session: Account<'info, FocusSession>,
    
    /// CHECK: We don't need the user to sign to slash them, but we need their pubkey for seeds
    pub user: AccountInfo<'info>,

    /// CHECK: PDA that holds the staked SOL
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    /// CHECK: Treasury wallet that receives slashed funds
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
}

#[account]
pub struct FocusSession {
    pub user: Pubkey,
    pub amount: u64,
    pub start_time: i64,
    pub duration_seconds: i64,
    pub is_active: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The focus session is not active.")]
    SessionInactive,
    #[msg("You are not authorized to interact with this session.")]
    Unauthorized,
    #[msg("The focus session has not finished yet.")]
    SessionNotFinished,
}
