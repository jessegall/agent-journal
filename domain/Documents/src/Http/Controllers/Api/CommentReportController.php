<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Api\RecordCommented;
use Domain\Documents\Api\ReportCommentPayload;
use Domain\Documents\Commands\CommentOnReport\CommentOnReportCommand;

final readonly class CommentReportController
{
    public function __invoke(ReportCommentPayload $call, CommandBus $commands): RecordCommented
    {
        return RecordCommented::from([
            'commentId' => $commands->run(new CommentOnReportCommand($call->reportId, $call->body)),
        ]);
    }
}
