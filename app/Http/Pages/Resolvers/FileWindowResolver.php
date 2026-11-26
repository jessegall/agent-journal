<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Hosts\ProjectFiles;
use App\Contracts\Hosts\ServedEnvironment;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Projects\FileComments;
use App\Data\Connections\FileThreadData;
use App\Data\Connections\FileWindowData;
use App\Enums\Connections\BindingReadiness;
use App\Enums\Connections\FileWindowStatus;
use App\Enums\Projects\ProjectReadFailure;
use App\Enums\Projects\ProjectReadStatus;
use App\Http\Requests\Connections\FileWindowRequest;
use App\Models\Agents\Agent;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectFile;
use App\Support\Layout\LayoutBodyData;
use App\Values\ProjectFileAnswer;
use Carbon\CarbonImmutable;

/**
 * A File window: the one file its query names, from the connected folder heard from last, read through its host and
 * split into lines no longer and no more than a window shows.
 */
final readonly class FileWindowResolver implements PageResolver
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
        private FileWindowRequest $request,
        private FileComments $comments,
    ) {}

    public function read(): FileWindowData
    {
        $path = $this->request->path();
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
            ProjectReadStatus::Failed, ProjectReadStatus::Expired => $this->window($this->failedState($answer), $path),
        };
    }

    private function failedState(ProjectFileAnswer $answer): FileWindowStatus
    {
        return match ($answer->failure) {
            ProjectReadFailure::Binary => FileWindowStatus::Binary,
            ProjectReadFailure::TooLarge => FileWindowStatus::TooLarge,
            default => FileWindowStatus::Failed,
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

        return FileWindowData::from([
            'status' => $isTruncated ? FileWindowStatus::TooLarge : FileWindowStatus::Ready,
            'name' => basename($answer->path),
            'path' => $answer->path,
            'isMarkdown' => $this->isMarkdown($answer->path),
            'lines' => $lines,
            'cutLineNumbers' => $cutLineNumbers,
            'isTruncated' => $isTruncated,
            'digest' => $answer->digest,
            'size' => $answer->size,
            ...$this->markdownOf($answer->path, $lines),
            ...$this->commentsOf($binding, $answer, $lines),
            ...$this->recipientOf($binding),
        ]);
    }

    private function window(FileWindowStatus $status, string $path): FileWindowData
    {
        return FileWindowData::from([
            'status' => $status,
            'name' => basename($path),
            'path' => $path,
            'isMarkdown' => $this->isMarkdown($path),
            'lines' => [],
            'cutLineNumbers' => [],
            'isTruncated' => false,
            'digest' => null,
            'size' => null,
            'commentTarget' => null,
            'threads' => [],
            'recipientId' => null,
            'recipientName' => null,
            'commentAddress' => $this->comments->commentAddress(),
            'tellAddress' => $this->comments->tellAddress(),
        ]);
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
     * The project's main agent, whom a comment on its files is sent to, and the address that tells it.
     *
     * @return array{recipientId: string, recipientName: string, commentAddress: string|null, tellAddress: string|null}
     */
    private function recipientOf(ProjectBinding $binding): array
    {
        $agent = Agent::query()->whereKey($binding->main_agent_id)->firstOrFail();

        return [
            'recipientId' => $agent->id,
            'recipientName' => $agent->name,
            'commentAddress' => $this->comments->commentAddress(),
            'tellAddress' => $this->comments->tellAddress(),
        ];
    }

    /**
     * A Markdown file's lines as the journal's safe HTML; nothing for any other file.
     *
     * @param  list<string>  $lines
     * @return array{markdown?: LayoutBodyData}
     */
    private function markdownOf(string $path, array $lines): array
    {
        if ($this->isMarkdown($path)) {
            return ['markdown' => LayoutBodyData::fromMarkdown(implode("\n", $lines))];
        }

        return [];
    }

    private function isMarkdown(string $path): bool
    {
        return in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['md', 'markdown'], true);
    }
}
