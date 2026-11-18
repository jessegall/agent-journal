<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Sharing\Concerns\ReadsConfirmedPreview;
use App\Http\Requests\Sharing\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use App\Sharing\Support\ShareDuration;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner approves the proposal the route names from a saved preview of its record, under the Idempotency-Key
 * header.
 */
final class ApproveShareRequestRequest extends FormRequest
{
    use ReadsConfirmedPreview, ReadsIdempotencyKey, ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [...$this->confirmedPreviewRules(), ...$this->idempotencyKeyRules(), 'minutes' => ['nullable', 'integer']];
    }

    public function minutesUntilExpiry(): int
    {
        return $this->integer('minutes', ShareDuration::STANDARD_MINUTES);
    }
}
