<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Enums\Engine\RefusalCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * For an exception that refuses a call the caller can fix: the framework renders it as its own status with its
 * message, instead of as a server error.
 */
trait RendersRefusal
{
    /**
     * The refusal as an agent route answers it: its code, its safe message and any details it gives. A browser's
     * request, which has a session, is answered by the web's own refusal rendering instead.
     */
    public function render(Request $request): JsonResponse|null
    {
        if ($request->hasSession()) {
            return null;
        }

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
