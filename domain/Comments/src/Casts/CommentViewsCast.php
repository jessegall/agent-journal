<?php

declare(strict_types=1);

namespace Domain\Comments\Casts;

use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Enums\CommentType;
use Spatie\LaravelData\Casts\Cast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Creation\CreationContext;
use Spatie\LaravelData\Support\DataProperty;

/**
 * Reads a list of comment views back from the arrays they travel as, each as the view its type names.
 */
final class CommentViewsCast implements Cast
{
    /**
     * @param  array<string, mixed>  $properties
     * @param  CreationContext<Data>  $context
     * @return list<RecordCommentView|TextCommentView>
     */
    public function cast(DataProperty $property, mixed $value, array $properties, CreationContext $context): array
    {
        $views = (array) $value;
        $texts = array_filter($views, fn (mixed $view): bool => self::typeOf($view) === CommentType::Text);
        $records = array_diff_key($views, $texts);
        $read = TextCommentView::collect($texts) + RecordCommentView::collect($records);
        ksort($read);

        return array_values($read);
    }

    /**
     * The type a view names, whether it arrives as a view or as the array it travels as.
     */
    private static function typeOf(mixed $view): CommentType
    {
        return match (true) {
            $view instanceof RecordCommentView, $view instanceof TextCommentView => $view->type,
            default => CommentType::from(data_get($view, 'type')),
        };
    }
}
