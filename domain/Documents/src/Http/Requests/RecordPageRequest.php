<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsCommentsPage;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Reads\Values\PageSize;
use Domain\Documents\Http\Requests\Concerns\ReadsLibraryFilters;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The number of the document or report a record page shows, from its route, and the comment its list goes on after
 * when the page reads its next comments.
 */
final class RecordPageRequest extends FormRequest
{
    use ReadsCommentsPage;
    use ReadsLibraryFilters;
    use ReadsRouteNumber;

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            ...$this->libraryRules(),
            'commentsAfter' => [
                'nullable',
                'string',
                'max:64',
            ],
            'commentLocation' => [
                'nullable',
                'string',
                'max:64',
            ],
            'sectionsVersion' => [
                'nullable',
                'string',
                'max:64',
            ],
            'textVersion' => [
                'nullable',
                'string',
                'max:64',
            ],
            'firstLine' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'lastLine' => [
                'nullable',
                'integer',
                'min:1',
            ],
            'tab' => [
                'nullable',
                'string',
                'max:40',
            ],
        ];
    }

    /**
     * The tab of the record's page the window chose; none chooses the page's first.
     */
    public function chosenTab(): string
    {
        return $this->string('tab')->toString();
    }

    /**
     * The comment whose location the page asked for, none or one.
     *
     * @return list<string>
     */
    public function commentIdsToLocate(): array
    {
        $asked = $this->optionalText('commentLocation');

        if ($asked === null) {
            return [];
        }

        return [$asked];
    }

    /**
     * The version whose sections the page asked for, none or one.
     *
     * @return list<string>
     */
    public function sectionsVersions(): array
    {
        $asked = $this->optionalText('sectionsVersion');

        if ($asked === null) {
            return [];
        }

        return [$asked];
    }

    /**
     * How many sections one read of them holds.
     */
    public function sectionsPageSize(): PageSize
    {
        return PageSize::from(100);
    }

    /**
     * The lines of a version the page asked for, by version, none or one.
     *
     * @return array<string, array{firstLine: int, lastLine: int|null}>
     */
    public function textPartsByVersion(): array
    {
        if (! $this->filled('textVersion')) {
            return [];
        }

        return [$this->string('textVersion')->toString() => [
            'firstLine' => $this->filled('firstLine') ? $this->integer('firstLine') : 1,
            'lastLine' => $this->filled('lastLine') ? $this->integer('lastLine') : null,
        ]];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function reportNumber(): int
    {
        return $this->routeNumber('report');
    }
}
