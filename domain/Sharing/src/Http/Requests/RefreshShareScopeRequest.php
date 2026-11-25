<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Requests;

use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Http\Requests\Concerns\ReadsIdempotencyKey;
use Domain\Sharing\Http\Requests\Concerns\ReadsConfirmedPreview;
use Domain\Sharing\Http\Requests\Concerns\ReadsShareId;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner replaces the members of the share the route names with a saved preview's selection, under the
 * Idempotency-Key header.
 */
final class RefreshShareScopeRequest extends FormRequest
{
    use ReadsConfirmedPreview;
    use ReadsIdempotencyKey;
    use ReadsShareId;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [...$this->confirmedPreviewRules(), ...$this->idempotencyKeyRules()];
    }

    public function command(): RefreshShareScopeCommand
    {
        return new RefreshShareScopeCommand(
            $this->shareId(),
            $this->previewId(),
            $this->previewChecksum(),
            $this->requestKey(),
        );
    }
}
