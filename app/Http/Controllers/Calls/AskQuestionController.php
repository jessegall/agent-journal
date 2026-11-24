<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AskQuestionCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\Messages\AskQuestion\AskQuestionCommand;
use App\Contracts\Bus\CommandBus;

final readonly class AskQuestionController
{
    public function __invoke(AskQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AskQuestionCommand($call->body, $call->relatedRecord?->identity()));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
