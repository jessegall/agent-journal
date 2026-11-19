<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowDraftController
{
    public function __invoke(DraftRequest $request, DraftResolver $drafts): JsonResponse
    {
        return new JsonResponse($drafts->current($request->documentNumber()));
    }
}
