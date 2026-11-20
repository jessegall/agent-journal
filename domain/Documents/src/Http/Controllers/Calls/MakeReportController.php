<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use Domain\Documents\Calls\MakeReportCall;
use Domain\Documents\Calls\RecordFiled;
use Domain\Documents\Commands\CreateReport;

/**
 * Files a report and answers its number and label.
 */
final readonly class MakeReportController
{
    public function __invoke(MakeReportCall $call, CommandBus $commands, RecordResolver $records): RecordFiled
    {
        $about = array_map(fn (string $name) => $records->identify(RecordReference::parse(trim($name))), $call->about);
        $created = $commands->run(new CreateReport(
            $call->title,
            $call->abstract,
            $call->body,
            $about,
            $call->uploadId,
        ));

        return RecordFiled::from([
            'id' => $created->id,
            'number' => (string) $created->number,
            'label' => $created->label(),
        ]);
    }
}
