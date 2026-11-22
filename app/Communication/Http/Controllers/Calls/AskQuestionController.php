<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\AskQuestionCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\AskQuestion\AskQuestionCommand;

final readonly class AskQuestionController
{
    public function __invoke(AskQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AskQuestionCommand($call->body, $call->relatedRecord?->identity()));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
