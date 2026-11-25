<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Requests;

use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use Domain\Sharing\Http\Requests\Concerns\ReadsConfirmedPreview;
use Domain\Sharing\Http\Requests\Concerns\ReadsShareId;
use Domain\Sharing\Support\ShareDuration;
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
