<?php

declare(strict_types=1);

namespace App\Bus\Exceptions\Concerns;

use App\Bus\Enums\RefusalCode;
use Illuminate\Http\JsonResponse;

/**
 * For an exception that refuses a call the caller can fix: the framework renders it as its own status with its
 * message, instead of as a server error.
 */
trait RendersRefusal
{
    /**
     * The refusal as every route answers it: its code, its safe message and any details it gives.
     */
    public function render(): JsonResponse
    {
        return new JsonResponse([
            'code' => $this->refusalCode()->value,
            'message' => $this->getMessage(),
            'details' => (object) $this->details(),
        ], $this->status());
    }

    abstract public function refusalCode(): RefusalCode;

    abstract protected function status(): int;

    /**
     * The facts a caller needs beyond the message; none unless the refusal gives some.
     *
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return [];
    }
}
