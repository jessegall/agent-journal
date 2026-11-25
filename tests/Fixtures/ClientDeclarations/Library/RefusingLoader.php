<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Exceptions\NotificationCursorInvalid;
use App\Exceptions\SessionRequestMissing;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use RuntimeException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A fixture loader that fails the way its input's shelf id names: a refusal, a missing row, a missing
 * page, a refused field, or a fault.
 */
final readonly class RefusingLoader
{
    public function __invoke(ShelfRowsInput $input): ShelfRowsData
    {
        throw match ($input->shelfId) {
            'refused' => SessionRequestMissing::forRequest('request-1'),
            'no-row' => new ModelNotFoundException(),
            'no-page' => new NotFoundHttpException(),
            'bad-cursor' => NotificationCursorInvalid::create(),
            default => new RuntimeException('The shelf broke.'),
        };
    }
}
