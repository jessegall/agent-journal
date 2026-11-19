<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Http\Requests\CreateRecordRequest;
use Illuminate\Http\JsonResponse;

final readonly class CreateDocumentController
{
    public function __invoke(CreateRecordRequest $request, CommandBus $commands, RecordResolver $records): JsonResponse
    {
        $created = $commands->run(new CreateDocument($request->title(), $request->abstract(), $request->body(), $request->about($records)));

        return new JsonResponse(['id' => $created->id, 'number' => (string) $created->number, 'label' => $created->label()], 201);
    }
}
