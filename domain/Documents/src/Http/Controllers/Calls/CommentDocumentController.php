<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Calls\DocumentCommentCall;
use Domain\Documents\Calls\RecordCommented;
use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;

final readonly class CommentDocumentController
{
    public function __invoke(DocumentCommentCall $call, CommandBus $commands): RecordCommented
    {
        return RecordCommented::from([
            'commentId' => $commands->run(new CommentOnDocumentCommand($call->documentId, $call->body)),
        ]);
    }
}
