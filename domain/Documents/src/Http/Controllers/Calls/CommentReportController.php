<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Calls\RecordCommented;
use Domain\Documents\Calls\ReportCommentCall;
use Domain\Documents\Commands\CommentOnReport\CommentOnReportCommand;

final readonly class CommentReportController
{
    public function __invoke(ReportCommentCall $call, CommandBus $commands): RecordCommented
    {
        return RecordCommented::from([
            'commentId' => $commands->run(new CommentOnReportCommand($call->reportId, $call->body)),
        ]);
    }
}
