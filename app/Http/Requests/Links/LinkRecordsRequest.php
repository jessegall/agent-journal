<?php

declare(strict_types=1);

namespace App\Http\Requests\Links;

use App\Contracts\Records\RecordResolver;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The two records a link joins, named as users name them, such as doc 12 and task 7.
 */
final class LinkRecordsRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'source' => ['required', 'string', 'max:64'],
            'target' => ['required', 'string', 'max:64'],
        ];
    }

    public function source(RecordResolver $records): RecordIdentity
    {
        return $records->identify(RecordReference::parse($this->sourceReference()));
    }

    public function target(RecordResolver $records): RecordIdentity
    {
        return $records->identify(RecordReference::parse($this->targetReference()));
    }

    /**
     * The source as it was named, such as doc 12.
     */
    public function sourceReference(): string
    {
        return $this->string('source')->toString();
    }

    /**
     * The target as it was named, such as task 7.
     */
    public function targetReference(): string
    {
        return $this->string('target')->toString();
    }
}
