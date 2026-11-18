<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsIdempotencyKey;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner makes the gateway revision the route names the default, or disables it, under the Idempotency-Key header.
 */
final class GatewayActionRequest extends FormRequest
{
    use ReadsIdempotencyKey;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return $this->idempotencyKeyRules();
    }

    public function configurationId(): string
    {
        return (string) $this->route('configuration');
    }
}
