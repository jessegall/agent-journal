<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\ReadMessageCall;
use App\Calls\Communication\ReadUnreadMessagesCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class ReadMessageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:read
        {message? : The id of the message to read; without one, every unread message is read}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Read one message, or every message you have not read yet';

    public function handle(): int
    {
        $messageId = $this->argument('message');

        return $this->runCall($messageId === null
            ? ReadUnreadMessagesCall::from(['requestKey' => $this->requestKey()])
            : ReadMessageCall::from([
                'messageId' => (string) $messageId,
                'requestKey' => $this->requestKey(),
            ]));
    }
}
