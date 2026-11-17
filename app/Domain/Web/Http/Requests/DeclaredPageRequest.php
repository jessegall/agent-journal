<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The query every declared page and Home share: the record open in the inspector (?inspect=<full page key> with the
 * record page's parameters), each window's own filters (window[<full page key>][...]) and the agent session chosen in
 * Chat. Each reader validates its own part with its own request class.
 */
final class DeclaredPageRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'inspect' => ['nullable', 'string', 'max:200'],
            'window' => ['nullable', 'array'],
            'session' => ['nullable', 'string', 'max:20'],
        ];
    }

    /**
     * The full key of the page open in the inspector, or an empty string when none is.
     */
    public function inspectedPage(): string
    {
        return $this->string('inspect')->toString();
    }

    public function parameter(string $name): string
    {
        return $this->string($name)->toString();
    }

    /**
     * The filters of one window on Home, under window[<full page key>].
     *
     * @return array<string, mixed>
     */
    public function windowQuery(string $key): array
    {
        $own = $this->array('window')[$key] ?? [];

        return is_array($own) ? $own : [];
    }

    /**
     * The whole query, as a page of its own hands it to its reader.
     *
     * @return array<string, mixed>
     */
    public function plainQuery(): array
    {
        return $this->query->all();
    }

    /**
     * The agent session chosen in Chat, as a decimal string, or an empty string when none is.
     */
    public function chosenSession(): string
    {
        return $this->string('session')->toString();
    }
}
