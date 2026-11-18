<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Bus\Support\RequestKey;
use App\Numbers\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Which record an agent proposes to share, as people name it, and the request key its signed body carries; who asks
 * comes from the request's actor alone.
 */
final class RequestShareRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'alias' => ['required', 'string', 'regex:/^[a-z][a-z-]*$/'],
            'number' => ['required', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
            'request_key' => ['required', 'string', 'max:'.RequestKey::LONGEST],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function reference(): RecordReference
    {
        return RecordReference::of($this->string('alias')->toString(), RecordReference::number($this->string('number')->toString()));
    }

    public function requestKey(): string
    {
        return $this->string('request_key')->toString();
    }
}
