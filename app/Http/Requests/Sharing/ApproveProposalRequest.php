<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing;

use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use App\Http\Requests\Sharing\Concerns\ReadsConfirmedPreview;
use App\Http\Requests\Sharing\Concerns\ReadsShareId;
use App\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Sharing\Support\ShareDuration;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner approves the proposal the route names from a saved preview of its record, under the Idempotency-Key
 * header.
 */
final class ApproveProposalRequest extends FormRequest
{
    use ReadsConfirmedPreview;
    use ReadsIdempotencyKey;
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            ...$this->confirmedPreviewRules(),
            ...$this->idempotencyKeyRules(),
            'minutes' => ['nullable', 'integer'],
        ];
    }

    public function command(): ApproveShareRequestCommand
    {
        return new ApproveShareRequestCommand(
            $this->shareId(),
            $this->previewId(),
            $this->previewChecksum(),
            $this->minutesUntilExpiry(),
            $this->requestKey(),
        );
    }

    private function minutesUntilExpiry(): int
    {
        return $this->integer('minutes', ShareDuration::STANDARD_MINUTES);
    }
}
