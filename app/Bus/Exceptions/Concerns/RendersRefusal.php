<?php

declare(strict_types=1);

namespace App\Bus\Exceptions\Concerns;

use Illuminate\Http\JsonResponse;

/**
 * For an exception that refuses a call the caller can fix: the framework renders it as its own status with its
 * message, instead of as a server error.
 */
trait RendersRefusal
{
    public function render(): JsonResponse
    {
        return new JsonResponse(['message' => $this->getMessage()], $this->status());
    }

    abstract protected function status(): int;
}
