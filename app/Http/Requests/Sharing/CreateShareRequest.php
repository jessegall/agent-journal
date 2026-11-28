<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Sharing\Concerns\ReadsConfirmedPreview;
use App\Sharing\Commands\CreateShare\CreateShareCommand;
use App\Sharing\Support\ShareDuration;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner confirms a saved preview into a share, for a number of minutes or the standard seven days, under the
 * Idempotency-Key header.
 */
final class CreateShareRequest extends FormRequest
{
    use ReadsConfirmedPreview;
    use ReadsIdempotencyKey;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->confirmedPreviewRules(),
            ...$this->idempotencyKeyRules(),
            'minutes' => [
                'nullable',
                'integer',
            ],
        ];
    }

    public function command(): CreateShareCommand
    {
        return new CreateShareCommand(
            $this->previewId(),
            $this->previewChecksum(),
            $this->minutesUntilExpiry(),
            $this->requestKey(),
        );
    }

    /**
     * The minutes asked for, or seven days when the owner named none; the command checks the bounds.
     */
    private function minutesUntilExpiry(): int
    {
        return $this->integer('minutes', ShareDuration::STANDARD_MINUTES);
    }
}
