<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Records\Contracts\RecordResolver;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A request about one record, named as users name it, such as doc 12.
 */
abstract class RecordTargetRequest extends FormRequest
{
    /**
     * The rules of the target field.
     *
     * @return list<string>
     */
    protected function targetRules(): array
    {
        return [
            'required',
            'string',
            'max:64',
        ];
    }

    /**
     * The record the request's target field names.
     */
    public function target(RecordResolver $records): RecordIdentity
    {
        return $records->identify(RecordReference::parse($this->string('target')->toString()));
    }
}
