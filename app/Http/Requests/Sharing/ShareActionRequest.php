<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner retries or revokes the share the route names, under the Idempotency-Key header.
 */
final class ShareActionRequest extends FormRequest
{
    use ReadsIdempotencyKey, ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->idempotencyKeyRules();
    }
}
