<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * A notification cursor that is malformed or was issued for another scope.
 */
final class NotificationCursorInvalid extends RuntimeException implements CodedRefusal
{
    public static function create(): self
    {
        return new self('This notification cursor is not valid for you.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    /**
     * The cursor is the request's own input, so it is answered as that field's validation error, browser or not.
     */
    public function render(): JsonResponse
    {
        return new JsonResponse(
            [
                'message' => $this->getMessage(),
                'errors' => ['cursor' => [$this->getMessage()]],
            ],
            $this->refusalCode()->status(),
        );
    }
}
