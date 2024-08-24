use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID_HERE");

#[program]
pub mod decentralized_poll {
    use super::*;

    pub fn create_poll(
        ctx: Context<CreatePoll>,
        question: String,
        options: Vec<String>,
        duration_in_seconds: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.question = question;
        poll.options = options;
        poll.votes = vec![0; poll.options.len()];
        poll.creator = *ctx.accounts.user.key;
        poll.created_at = Clock::get()?.unix_timestamp as u64;
        poll.end_time = poll.created_at + duration_in_seconds;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        
        // Check if voting period is still active
        let current_time = Clock::get()?.unix_timestamp as u64;
        require!(current_time <= poll.end_time, PollError::PollExpired);
        
        // Ensure valid option index
        require!(
            (option_index as usize) < poll.options.len(),
            PollError::InvalidOption
        );
        
        // Check if user has already voted
        require!(!poll.voters.contains(&ctx.accounts.user.key()), PollError::AlreadyVoted);

        poll.votes[option_index as usize] += 1;
        poll.voters.push(*ctx.accounts.user.key());

        Ok(())
    }

    pub fn get_poll(ctx: Context<GetPoll>) -> Result<(String, Vec<String>, Vec<u64>, u64)> {
        let poll = &ctx.accounts.poll;
        Ok((poll.question.clone(), poll.options.clone(), poll.votes.clone(), poll.end_time))
    }
}

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(init, payer = user, space = 1024)]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut, has_one = creator)]
    pub poll: Account<'info, Poll>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetPoll<'info> {
    pub poll: Account<'info, Poll>,
}

#[account]
pub struct Poll {
    pub question: String,
    pub options: Vec<String>,
    pub votes: Vec<u64>,
    pub voters: Vec<Pubkey>, // Track voters to prevent double voting
    pub creator: Pubkey, // Store the creator's address
    pub created_at: u64, // Poll creation time
    pub end_time: u64, // Poll expiration time
}

#[error_code]
pub enum PollError {
    #[msg("The poll has expired.")]
    PollExpired,
    #[msg("Invalid voting option.")]
    InvalidOption,
    #[msg("User has already voted.")]
    AlreadyVoted,
}
