<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A settlement asked for by an agent or from a record page: the record, the reason, and for a document the revision
 * the settler read.
 */
final class SettleRecordRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'number' => ['sometimes', 'string'],
            'reason' => ['required', 'string'],
            'revision' => ['required', 'integer', 'min:1'],
        ];
    }

    public function number(): int
    {
        return RecordReference::number($this->string('number')->toString());
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function reportNumber(): int
    {
        return $this->routeNumber('report');
    }

    public function reason(): string
    {
        return $this->string('reason')->toString();
    }

    public function revision(): int
    {
        return $this->integer('revision');
    }
}
