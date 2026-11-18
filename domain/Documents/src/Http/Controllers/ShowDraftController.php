<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Domain\Documents\Contracts\DraftReader;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

final readonly class ShowDraftController
{
    public function __invoke(DraftRequest $request, DraftReader $drafts): JsonResponse
    {
        return new JsonResponse($drafts->current($request->documentNumber()));
    }
}
