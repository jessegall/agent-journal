<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Every attempt to change a filed report: reports are snapshots, so nothing changes and the answer says what to do.
 */
final readonly class EditReportController
{
    public const string SNAPSHOT_NOTICE = 'A report is a snapshot of one moment and never changes. To correct it, file a new report that links to this one.';

    public function __invoke(): JsonResponse
    {
        return new JsonResponse(['message' => self::SNAPSHOT_NOTICE], 409);
    }
}
