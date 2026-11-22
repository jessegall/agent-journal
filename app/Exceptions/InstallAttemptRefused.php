<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

/**
 * A change to an install attempt that does not go on: an attempt this owner does not have, one a newer change
 * already moved on, or one that is settled. A settled attempt answers what came of it, never a new line.
 */
final class InstallAttemptRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private int $status = 409;

    private RefusalCode $refusalCode = RefusalCode::StateBlocked;

    /**
     * @var array<string, string|int>
     */
    private array $outcome = [];

    public static function unknown(string $reference): self
    {
        $refusal = new self("There is no install attempt {$reference}.");
        $refusal->status = 404;
        $refusal->refusalCode = RefusalCode::RecordUnavailable;

        return $refusal;
    }

    public static function notAllowed(): self
    {
        $refusal = new self('Only the owner who connects projects sees and changes install attempts.');
        $refusal->status = 403;
        $refusal->refusalCode = RefusalCode::Forbidden;

        return $refusal;
    }

    public static function movedOn(string $reference, int $version): self
    {
        $refusal = new self("Install attempt {$reference} changed since you saw it; it is at version {$version} now.");
        $refusal->outcome = ['reference' => $reference, 'version' => $version];

        return $refusal;
    }

    public static function spent(string $reference, string $bindingId): self
    {
        $refusal = new self("Install attempt {$reference} was already used: it connected binding {$bindingId}.");
        $refusal->outcome = ['reference' => $reference, 'state' => 'spent', 'bindingId' => $bindingId];

        return $refusal;
    }

    public static function cancelled(string $reference): self
    {
        $refusal = new self("Install attempt {$reference} was cancelled; start a new one for another line.");
        $refusal->outcome = ['reference' => $reference, 'state' => 'cancelled'];

        return $refusal;
    }

    /**
     * The refusal with what came of the attempt, for every caller that reads JSON, a signed-in browser too: a stale
     * tab needs the binding a spent attempt made, or the version it is at now.
     */
    public function render(Request $request): JsonResponse|null
    {
        if (! $request->expectsJson()) {
            return null;
        }

        return new JsonResponse([
            'code' => $this->refusalCode()->value,
            'message' => $this->getMessage(),
            'details' => (object) $this->details(),
        ], $this->status());
    }

    public function refusalCode(): RefusalCode
    {
        return $this->refusalCode;
    }

    /**
     * @return array<string, string|int>
     */
    protected function details(): array
    {
        return $this->outcome;
    }

    protected function status(): int
    {
        return $this->status;
    }
}
