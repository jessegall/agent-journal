<?php

declare(strict_types=1);

namespace App\Http\Requests\Comments;

use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordReader;
use App\Records\Support\RecordIdentity;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A request about one record's comments, the record named as people name it, such as doc 12.
 */
abstract class CommentTargetRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    protected function targetRules(): array
    {
        return ['target' => ['required', 'string', 'max:64']];
    }

    public function target(RecordReader $records): RecordIdentity
    {
        return $records->identify(RecordReference::parse($this->string('target')->toString()));
    }
}
