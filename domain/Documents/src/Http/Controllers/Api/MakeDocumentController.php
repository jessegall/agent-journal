<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;
use Domain\Documents\Api\MakeDocumentPayload;
use Domain\Documents\Api\RecordFiled;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;

/**
 * Files a document and answers its number and label.
 */
final readonly class MakeDocumentController
{
    public function __invoke(MakeDocumentPayload $call, CommandBus $commands, RecordResolver $records): RecordFiled
    {
        $relatedRecords = array_map(
            fn (string $name) => $records->identify(RecordReference::parse(trim($name))),
            $call->relatedRecords,
        );

        $created = $commands->run(new CreateDocumentCommand(
            $call->title,
            $call->abstract,
            $call->body,
            $relatedRecords,
            $call->uploadId,
        ));

        return RecordFiled::from([
            'id' => $created->id,
            'number' => (string) $created->number,
            'label' => $created->label(),
            'revision' => $created->revision,
        ]);
    }
}
