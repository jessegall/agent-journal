<?php

declare(strict_types=1);

namespace App\Http\Requests\Concerns;

use App\Support\RequestKey;

/**
 * An owner write that needs its Idempotency-Key header: the header is validated with the body, and its value is the
 * request key the command carries.
 */
trait ReadsIdempotencyKey
{
    private const string IDEMPOTENCY_HEADER = 'Idempotency-Key';

    /**
     * @return array<string, mixed>
     */
    public function validationData(): array
    {
        return [...$this->all(), 'idempotency_key' => $this->header(self::IDEMPOTENCY_HEADER)];
    }

    /**
     * @return array<string, list<string>>
     */
    protected function idempotencyKeyRules(): array
    {
        return ['idempotency_key' => ['required', 'string', 'max:'.RequestKey::LONGEST, 'regex:/^[A-Za-z0-9-]+$/']];
    }

    public function requestKey(): string
    {
        return (string) $this->header(self::IDEMPOTENCY_HEADER);
    }
}
