<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Communication\ReadMessagePayload;
use App\Api\Communication\ReadUnreadMessagesPayload;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

final class ReadMessageCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'message:read
        {message? : The id of the message to read; without one, every unread message is read}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Read one message, or every message you have not read yet';

    public function handle(): int
    {
        $messageId = $this->argument('message');

        return $this->runCall($messageId === null
            ? ReadUnreadMessagesPayload::from(['requestKey' => $this->requestKey()])
            : ReadMessagePayload::from(['messageId' => (string) $messageId, 'requestKey' => $this->requestKey()]));
    }
}
