<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The query every declared page and Home share: the record open in the inspector (?inspect=<full page key> with the
 * record page's parameters), each window's own filters (window[<full page key>][...]) and the agent session chosen in
 * Chat. Each reader validates its own part with its own request class.
 */
final class DeclaredPageRequest extends FormRequest
{
    /**
     * The most copies of one window Home serves in one request.
     */
    public const int COPY_LIMIT = 8;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'inspect' => ['nullable', 'string', 'max:200'],
            'window' => ['nullable', 'array'],
            'session' => ['nullable', 'string', 'ulid'],
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
     * The ids of the copies of a window whose props this partial visit asks for by name, <prop>__<copy id>, at most
     * COPY_LIMIT of them; an id is only an address, read as twelve hexadecimal characters.
     *
     * @return list<string>
     */
    public function copiesAskedFor(string $propName): array
    {
        $copies = [];

        foreach (explode(',', (string) $this->header('X-Inertia-Partial-Data')) as $asked) {
            if (preg_match('/^'.preg_quote($propName, '/').'__([a-f0-9]{12})$/', trim($asked), $match) === 1) {
                $copies[] = $match[1];
            }
        }

        return array_slice(array_values(array_unique($copies)), 0, self::COPY_LIMIT);
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
