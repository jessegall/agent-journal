<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CompleteSignIn;

use App\Accounts\SignInCompletion;
use App\Bus\Contracts\CommandHandler;

final readonly class CompleteSignInHandler implements CommandHandler
{
    public function __construct(private SignInCompletion $completion) {}

    public function handle(CompleteSignInCommand $command): void
    {
        $this->completion->complete($command->attemptId, $command->generation, $command->identity);
    }
}
