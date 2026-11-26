<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Projects\Contracts\ProjectDestination;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;
use Domain\Documents\Api\MakeReportPayload;
use Domain\Documents\Api\RecordFiled;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use PhpOption\None;

/**
 * Files a report and answers its number and label.
 */
final readonly class MakeReportController
{
    #[Dispatches(CreateReportCommand::class)]
    public function __invoke(
        MakeReportPayload $call,
        CommandBus $commands,
        RecordResolver $records,
        ProjectDestination $destination,
    ): RecordFiled {
        $relatedRecords = array_map(
            fn (string $name) => $records->identify(RecordReference::parse(trim($name))),
            $call->relatedRecords,
        );

        $created = $commands->run(new CreateReportCommand(
            $call->title,
            $call->abstract,
            $call->body,
            $destination->projectFor(None::create()),
            $relatedRecords,
            $call->uploadId,
        ));

        return RecordFiled::from([
            'id' => $created->id,
            'number' => (string) $created->number,
            'label' => $created->label(),
        ]);
    }
}
