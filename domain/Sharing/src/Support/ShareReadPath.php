<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Exceptions\InvalidRecordIdentity;
use Domain\Sharing\Exceptions\ShareReadRefused;
use App\Exceptions\UnknownShareRecordType;
use App\Exceptions\UnknownShareRelation;
use App\Support\RecordIdentity;
use App\Support\ShareRecordRegistry;

/**
 * The way a public read goes from the shared root: at most four steps, each a relation the record of that step
 * declares and the record it leads to by link alias and ULID, written as relation/alias/id per step. A record is
 * never visited twice; user numbers are not part of a path.
 */
final readonly class ShareReadPath
{
    public const int MOST_HOPS = 4;

    /**
     * @param  list<ShareReadHop>  $hops
     */
    private function __construct(
        public string $text,
        public array $hops,
    ) {}

    /**
     * Reads the path after the token, checking every step against the relations each record type declared at boot.
     *
     * @throws ShareReadRefused when the path is malformed, too deep or circular
     * @throws UnknownShareRelation when a step follows a relation its record does not declare
     * @throws UnknownShareRecordType when a step's record type is not shareable
     */
    public static function parse(string $text, RecordIdentity $root, ShareRecordRegistry $records): self
    {
        $segments = $text === '' ? [] : explode('/', trim($text, '/'));

        if (count($segments) % 3 !== 0) {
            throw ShareReadRefused::malformedPath();
        }

        $steps = array_chunk($segments, 3);

        if (count($steps) > self::MOST_HOPS) {
            throw ShareReadRefused::tooDeep(self::MOST_HOPS);
        }

        $hops = [];
        $visited = [$root];
        $from = $root;

        foreach ($steps as [$relation, $alias, $id]) {
            $records->relation($from->type, $relation);
            $target = self::identity($alias, $id);

            foreach ($visited as $seen) {
                if ($seen->isSameAs($target)) {
                    throw ShareReadRefused::circular();
                }
            }

            $hops[] = new ShareReadHop($relation, $target);
            $visited[] = $target;
            $from = $target;
        }

        return new self(implode('/', $segments), $hops);
    }

    /**
     * The record the path ends at: the root for an empty path.
     */
    public function target(RecordIdentity $root): RecordIdentity
    {
        if ($this->hops === []) {
            return $root;
        }

        return $this->hops[array_key_last($this->hops)]->target;
    }

    /**
     * @throws ShareReadRefused
     */
    private static function identity(string $alias, string $id): RecordIdentity
    {
        try {
            return new RecordIdentity($alias, $id);
        } catch (InvalidRecordIdentity $cause) {
            throw ShareReadRefused::malformedPath(previous: $cause);
        }
    }
}
