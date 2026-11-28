<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Connections\Data\FileThreadData;
use App\Connections\Data\FileWindowData;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\FileWindowStatus;
use App\Connections\Layout\LayoutBodyData;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\Contracts\ServedEnvironment;
use App\Http\Requests\Connections\FileWindowRequest;
use App\Models\Agents\Agent;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Projects\Contracts\FileComments;
use App\Projects\Enums\ProjectReadStatus;
use App\Reads\PageFormRequests;
use App\Values\ProjectFileAnswer;
use App\Web\Creation\Contracts\PageBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Spatie\LaravelData\Optional;

/**
 * A File window: the one file its query names, from the connected folder heard from last, read through its host and
 * split into lines no longer and no more than a window shows.
 */
final readonly class FilePageBuilder implements PageBuilder
{
    /**
     * The most lines a File window shows; the rest of the file is left out and the window says so.
     */
    public const int LINE_COUNT_LIMIT = 5000;

    /**
     * The most characters a File window shows of one line; a longer line is cut and named.
     */
    public const int LINE_CHARACTER_LIMIT = 2000;

    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private PageFormRequests $requests,
        private FileComments $comments,
    ) {}

    public function build(Request $visit): FileWindowData
    {
        $input = $this->requests->forVisit(FileWindowRequest::class, $visit);

        $path = $input->path();
        $found = ProjectBinding::findLastHeardFromIn($this->served->environmentIds());

        if (! $found->isDefined()) {
            return $this->window(FileWindowStatus::None, $path);
        }

        if ($path === '') {
            return $this->window(FileWindowStatus::Empty, $path);
        }

        $binding = $found->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $this->window(FileWindowStatus::Offline, $path);
        }

        $answer = $this->files->file($binding, $path);

        return match ($answer->status) {
            ProjectReadStatus::Pending => $this->window(FileWindowStatus::Pending, $path),
            ProjectReadStatus::Answered => $this->answered($binding, $answer),
            ProjectReadStatus::Failed, ProjectReadStatus::Expired => $this->window(FileWindowStatus::fromFailure($answer->failure), $path),
        };
    }

    /**
     * The file's lines, at most LINE_COUNT_LIMIT of them and each at most LINE_CHARACTER_LIMIT characters; a file the
     * host or this window cut short is too large to show whole.
     */
    private function answered(ProjectBinding $binding, ProjectFileAnswer $answer): FileWindowData
    {
        $read = preg_split('/\r?\n/', (string) $answer->text) ?: [];
        $isTruncated = $answer->isTruncated || count($read) > self::LINE_COUNT_LIMIT;
        $lines = [];
        $cutLineNumbers = [];

        foreach (array_slice($read, 0, self::LINE_COUNT_LIMIT) as $index => $line) {
            if (mb_strlen($line) > self::LINE_CHARACTER_LIMIT) {
                $cutLineNumbers[] = $index + 1;
            }

            $lines[] = mb_substr($line, 0, self::LINE_CHARACTER_LIMIT);
        }

        $comments = $this->commentsOf($binding, $answer, $lines);
        $agent = Agent::query()->whereKey($binding->main_agent_id)->firstOrFail();

        return FileWindowData::build()
            ->status($isTruncated ? FileWindowStatus::TooLarge : FileWindowStatus::Ready)
            ->name(basename($answer->path))
            ->path($answer->path)
            ->isMarkdown($this->isMarkdown($answer->path))
            ->lines($lines)
            ->cutLineNumbers($cutLineNumbers)
            ->isTruncated($isTruncated)
            ->digest($answer->digest)
            ->size($answer->size)
            ->markdown($this->markdownOf($answer->path, $lines))
            ->commentTarget($comments['commentTarget'])
            ->threads($comments['threads'])
            ->recipientId($agent->id)
            ->recipientName($agent->name)
            ->commentAddress($this->comments->commentAddress())
            ->tellAddress($this->comments->tellAddress())
            ->finish();
    }

    private function window(FileWindowStatus $status, string $path): FileWindowData
    {
        return FileWindowData::build()
            ->status($status)
            ->name(basename($path))
            ->path($path)
            ->isMarkdown($this->isMarkdown($path))
            ->lines([])
            ->cutLineNumbers([])
            ->isTruncated(false)
            ->digest(null)
            ->size(null)
            ->commentTarget(null)
            ->threads([])
            ->recipientId(null)
            ->recipientName(null)
            ->commentAddress($this->comments->commentAddress())
            ->tellAddress($this->comments->tellAddress())
            ->finish();
    }

    /**
     * The file's record, once a version of it is kept and files take comments, and the threads on the version shown.
     *
     * @param  list<string>  $lines
     * @return array{commentTarget: string|null, threads: list<FileThreadData>}
     */
    private function commentsOf(ProjectBinding $binding, ProjectFileAnswer $answer, array $lines): array
    {
        $found = ProjectFile::findAtPath($binding->id, $answer->path);

        if (! $found->isDefined() || $this->comments->tellAddress() === null) {
            return [
                'commentTarget' => null,
                'threads' => [],
            ];
        }

        $file = $found->get();

        return [
            'commentTarget' => "file {$file->number}",
            'threads' => $this->comments->threadsOn($file, $answer->digest, $lines),
        ];
    }

    /**
     * A Markdown file's lines as the journal's safe HTML; nothing for any other file.
     *
     * @param  list<string>  $lines
     */
    private function markdownOf(string $path, array $lines): LayoutBodyData|Optional
    {
        if ($this->isMarkdown($path)) {
            return LayoutBodyData::fromMarkdown(implode("\n", $lines));
        }

        return Optional::create();
    }

    private function isMarkdown(string $path): bool
    {
        return in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['md', 'markdown'], true);
    }
}
