<?php

declare(strict_types=1);

namespace App\Commands\CompleteSignIn;

use App\Contracts\Bus\CommandHandler;
use App\Support\SignInCompletion;

final readonly class CompleteSignInHandler implements CommandHandler
{
    public function __construct(private SignInCompletion $completion) {}

    public function handle(CompleteSignInCommand $command): void
    {
        $this->completion->complete($command->attemptId, $command->generation, $command->identity);
    }
}
