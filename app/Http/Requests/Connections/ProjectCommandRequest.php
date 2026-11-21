<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\AgentRequests\Support\SignedCall;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A connected machine's journal verb: the request id that keeps it from running twice, the binding it runs for, the
 * arguments as typed after journal, and what was piped into it.
 */
final class ProjectCommandRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9_-]+$/'],
            'binding' => ['required', 'string', 'ulid'],
            'argv' => ['required', 'array', 'min:2', 'max:200'],
            'argv.*' => ['string', 'max:8192'],
            'stdin' => ['present', 'nullable', 'string', 'max:1048576'],
        ];
    }

    public function requestId(): string
    {
        return $this->string('requestId')->toString();
    }

    public function bindingId(): string
    {
        return $this->string('binding')->toString();
    }

    /**
     * @return list<string>
     */
    public function argv(): array
    {
        return array_values(array_map(strval(...), (array) $this->input('argv')));
    }

    public function stdin(): string
    {
        return $this->string('stdin')->toString();
    }

    /**
     * The verb as artisan names it: the subject and the verb, joined by a colon.
     */
    public function verbName(): string
    {
        $argv = $this->argv();

        return "{$argv[0]}:{$argv[1]}";
    }

    /**
     * The calling start's own credential and profile pin, which the verb's client signs its calls with.
     *
     * @return array<string, string>
     */
    public function startEnvironment(string $journalUrl): array
    {
        return [
            'JOURNAL_URL' => $journalUrl,
            'JOURNAL_START_TOKEN' => (string) $this->bearerToken(),
            'JOURNAL_PROFILE' => (string) $this->header(SignedCall::PROFILE_HEADER),
            'JOURNAL_PROFILE_REVISION' => (string) $this->header(SignedCall::PROFILE_REVISION_HEADER),
        ];
    }
}
