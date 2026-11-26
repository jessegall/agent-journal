<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * A kind of actor a request or a command line may name, such as the recipient of work or of a question.
 */
interface RecipientActor extends StoredActor {}
