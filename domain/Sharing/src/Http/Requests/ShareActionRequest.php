<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Requests;

use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use Domain\Sharing\Http\Requests\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner retries or revokes the share the route names, under the Idempotency-Key header.
 */
final class ShareActionRequest extends FormRequest
{
    use ReadsIdempotencyKey;
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->idempotencyKeyRules();
    }
}
