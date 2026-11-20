<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use Domain\Documents\Calls\MakeDocumentCall;
use Domain\Documents\Calls\RecordFiled;
use Domain\Documents\Commands\CreateDocument;

/**
 * Files a document and answers its number and label.
 */
final readonly class MakeDocumentController
{
    public function __invoke(MakeDocumentCall $call, CommandBus $commands, RecordResolver $records): RecordFiled
    {
        $about = array_map(fn (string $name) => $records->identify(RecordReference::parse(trim($name))), $call->about);
        $created = $commands->run(new CreateDocument(
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
            'revision' => $created->revision,
        ]);
    }
}
