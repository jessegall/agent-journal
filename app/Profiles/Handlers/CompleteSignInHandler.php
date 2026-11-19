<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Support\SignInCompletion;

final readonly class CompleteSignInHandler implements CommandHandler
{
    public function __construct(private SignInCompletion $completion) {}

    public function handle(CompleteSignIn $command): void
    {
        $this->completion->complete($command->attemptId, $command->generation, $command->identity);
    }
}
