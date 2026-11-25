<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Contracts\Records\RecordResolver;
use App\Http\Requests\Concerns\ReadsChosenProject;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The text of a new document or report. The limits are checked by MarkdownText in the command; this only asks for
 * the three strings.
 */
final class CreateRecordRequest extends FormRequest
{
    use ReadsChosenProject;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string'],
            'abstract' => ['required', 'string'],
            'body' => ['required', 'string'],
            'about' => ['nullable', 'array'],
            'about.*' => ['string', 'max:64'],
            ...$this->projectRules(),
        ];
    }

    public function title(): string
    {
        return $this->string('title')->toString();
    }

    public function abstract(): string
    {
        return $this->string('abstract')->toString();
    }

    /**
     * The records the new one is about, named as users name them, such as task 12.
     *
     * @return list<RecordIdentity>
     */
    public function about(RecordResolver $records): array
    {
        return array_values(
            array_map(
                fn (string $reference) => $records->identify(RecordReference::parse(trim($reference))),
                array_filter((array) $this->input('about', []), is_string(...)),
            ),
        );
    }

    public function body(): string
    {
        return (string) $this->input('body');
    }
}
