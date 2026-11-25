<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Api\DocumentCommentPayload;
use Domain\Documents\Api\RecordCommented;
use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;

final readonly class CommentDocumentController
{
    public function __invoke(DocumentCommentPayload $call, CommandBus $commands): RecordCommented
    {
        return RecordCommented::from([
            'commentId' => $commands->run(new CommentOnDocumentCommand($call->documentId, $call->body)),
        ]);
    }
}
