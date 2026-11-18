<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Numbers\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The number of the document or report to show, read through the one record number parser.
 */
final class ShowRecordRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['number' => ['required', 'string']];
    }

    public function number(): int
    {
        return RecordReference::number($this->string('number')->toString());
    }
}
