<?php

declare(strict_types=1);

/**
 * The naming rules, judged from the grammar of each name with the code's own verbs, so no
 * list of names is kept: a thing is a noun for what it is, an action starts with its verb, an event says what happened
 * and a yes-or-no answer reads as a question. docs/naming/forbidden-words.txt adds the words no name may hold and the
 * verbs that have a better word.
 */

require_once __DIR__.'/name-word-splitting.php';

/**
 * The folders whose classes are actions, named with their verb first: steps, pipelines, commands, listeners and jobs.
 * A console command is named subject first, as it is typed (ReportMakeCommand for report make).
 * What only helps the actions of such a folder sits in its Support subfolder and is named as a noun.
 */
const ACTION_FOLDERS = '#/(Pipes|Pipelines|(?<!Console/)Commands|Listeners|Jobs)/(?!(?:[^/]+/)?Support/)#';

/**
 * The words that open a yes-or-no question.
 */
const QUESTION_WORDS = [
    'is',
    'are',
    'has',
    'have',
    'can',
    'should',
    'must',
    'may',
    'does',
    'was',
    'were',
    'will',
    'needs',
];

/**
 * The words that make "to" and a verb a noun phrase of their own: how to fix, what to answer.
 */
const INTERROGATIVE_WORDS = [
    'how',
    'what',
    'when',
    'where',
    'which',
    'whom',
];

/**
 * The endings of a past form, which an event's last word has: requested, written, sent, held, begun.
 */
/**
 * The verbs that tell someone of something: their object is a happening, named as an event is.
 */
const TELLING_VERBS = [
    'notify',
    'announce',
    'broadcast',
    'tell',
    'inform',
    'alert',
    'warn',
    'signal',
    'raise',
    'emit',
    'notice',
    'publish',
];

const ROLE_SUFFIXES = [
    'command',
    'handler',
    'controller',
    'request',
    'job',
    'listener',
    'pipeline',
];

const IRREGULAR_PARTICIPLES = [
    'withdrawn',
    'drawn',
    'shown',
    'known',
    'grown',
    'thrown',
    'blown',
    'flown',
    'taken',
    'given',
    'written',
    'hidden',
    'broken',
    'chosen',
    'frozen',
    'spoken',
    'stolen',
    'forgotten',
    'gotten',
    'done',
    'gone',
    'seen',
    'begun',
    'run',
    'held',
    'kept',
    'sent',
    'lost',
    'found',
    'built',
    'left',
    'made',
    'paid',
    'read',
    'said',
    'sold',
    'told',
    'bought',
    'brought',
    'caught',
    'taught',
    'thought',
    'spent',
    'bound',
    'won',
    'shut',
    'set',
    'put',
    'cut',
    'hit',
    'let',
    'split',
];

const PAST_FORM = '/(ed|en|wn|ne|ung|un|ound|ought|aught|ent|ept|eft|eld|old|ost|ade|aid|ead|ut|et|it|uck|ook|ew|ame)$/';

/**
 * The verbs of the code, learned from its actions: those a command method or function starts with, and with
 * $shouldIncludeActionClasses also those an action class starts with. A test's helpers are left out, since a test may name a
 * step for its subject.
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function verbsOf(array $names, bool $shouldIncludeActionClasses): array
{
    $verbs = [];

    foreach ($names as $declared) {
        $isTest = preg_match('#Test\.php|_test\.go|tests/Support/#', $declared->place) === 1;
        $isCommand = $declared->role === 'action' && in_array($declared->declarationType, ['method', 'function'], true)
            && ! str_contains($declared->place, '.sh');
        $isActionClass = $shouldIncludeActionClasses && $declared->role === 'action' && $declared->declarationType === 'class';

        if (! $isTest && ($isCommand || $isActionClass)) {
            $verbs[firstWordOf($declared->name)] = true;
        }
    }

    unset($verbs['']);

    return [
        ...$verbs,
        ...inflectedVerbsOf($names),
    ];
}

/**
 * The words the code also uses inflected as verbs are (trusted, building), so a verb no command starts with yet is
 * still known: a word is a verb when a name holds it with -ed or -ing.
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function inflectedVerbsOf(array $names): array
{
    $verbs = [];

    foreach ($names as $declared) {
        foreach (wordsOf($declared->name) as $word) {
            if (preg_match('/^(\w{2,}?)(e?d|ing)$/', $word, $match) === 1) {
                $verbs[$match[1]] = true;
                $verbs[$match[1].'e'] = true;
                // A doubled last consonant is the spelling of the inflection: pinned, scanning.
                $verbs[(string) preg_replace('/([b-df-hj-np-tv-z])\1$/', '$1', $match[1])] = true;
            }
        }
    }

    return $verbs;
}

/**
 * The words the grammar learns from the whole code: its verbs, nouns, events and type names. A scan of the whole code
 * writes it to a file, and a scan of a few files (the staged ones) reads it from there, so they judge alike.
 */
final readonly class NameVocabulary
{
    /**
     * @param  array<string, true>  $verbs
     * @param  array<string, true>  $commandVerbs
     * @param  array<string, true>  $nouns
     * @param  array<string, true>  $sharedVerbs
     * @param  array<string, true>  $happenings
     * @param  array<string, true>  $typeNames
     */
    public function __construct(
        public array $verbs,
        public array $commandVerbs,
        public array $nouns,
        public array $sharedVerbs,
        public array $happenings,
        public array $typeNames,
    ) {}

    /**
     * @param  list<DeclaredName>  $names
     */
    public static function of(array $names): self
    {
        $types = array_filter($names, fn (DeclaredName $declared) => $declared->declarationType === 'class');

        return new self(
            verbsOf($names, shouldIncludeActionClasses: true),
            verbsOf($names, shouldIncludeActionClasses: false),
            nounsOf($names),
            sharedActionWordsOf($names),
            happeningsOf($names),
            array_fill_keys(array_map(fn (DeclaredName $declared) => $declared->name, $types), true),
        );
    }

    public static function fromFile(string $path): self
    {
        $words = json_decode((string) file_get_contents($path), true, 4, JSON_THROW_ON_ERROR);
        $set = fn (string $key) => array_fill_keys($words[$key], true);

        return new self($set('verbs'), $set('commandVerbs'), $set('nouns'), $set('sharedVerbs'), $set('happenings'), $set('typeNames'));
    }

    public function writeTo(string $path): void
    {
        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0o755, true);
        }

        $words = array_map(fn (array $set) => array_map('strval', array_keys($set)), get_object_vars($this));
        file_put_contents($path, json_encode($words, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."\n");
    }
}

/**
 * Each name that breaks a naming rule, as "type name (place): why", judged with the words of the whole code.
 *
 * @param  list<DeclaredName>  $names
 * @return list<string>
 */
function nameFaults(array $names, NameVocabulary $vocabulary, string $forbiddenWordsFile): array
{
    $forbidden = forbiddenWords($forbiddenWordsFile);
    $betterVerbs = betterVerbs($forbiddenWordsFile);
    $verbs = $vocabulary->verbs;
    $commandVerbs = $vocabulary->commandVerbs;
    $nouns = $vocabulary->nouns;
    $sharedVerbs = $vocabulary->sharedVerbs;
    $happenings = $vocabulary->happenings;
    $typeNames = $vocabulary->typeNames;
    $faults = [];

    foreach ($names as $declared) {
        $reasons = array_filter([
            forbiddenWordFault($declared, $forbidden),
            betterVerbFault($declared, $betterVerbs),
            // A test is named for its subject, which is judged itself: HandManagedSettingsToHostTest.
            isset($typeNames[preg_replace('/Test$/', '', $declared->name)]) && $declared->name !== preg_replace('/Test$/', '', $declared->name)
                ? null : purposeFault($declared, $verbs, $nouns),
            actionClassFault($declared, $commandVerbs, $nouns, $sharedVerbs),
            eventFault($declared),
            stateFault($declared),
            participleOrderFault($declared, $verbs, $nouns, $happenings),
            commandMoodFault($declared, $verbs),
            questionFault($declared, $verbs),
            getterFault($declared),
            shellFunctionFault($declared, $verbs, $nouns),
        ]);

        foreach ($reasons as $reason) {
            $faults[] = "{$declared->declarationType} {$declared->name} ({$declared->place}): {$reason}";
        }
    }

    return array_values(array_unique($faults));
}

/**
 * @param  array<string, string>  $forbidden
 */
function forbiddenWordFault(DeclaredName $declared, array $forbidden): string|null
{
    if ($declared->role === 'override') {
        return null;
    }

    $words = array_values(array_unique(array_filter(wordsOf($declared->name), fn (string $word) => isset($forbidden[$word]))));

    if ($words === []) {
        return null;
    }

    return 'holds the forbidden '.implode(', ', array_map(fn (string $word) => $forbidden[$word], $words));
}

/**
 * An action's verb that has a better coding word: report says notify.
 *
 * @param  array<string, string>  $betterVerbs
 */
function betterVerbFault(DeclaredName $declared, array $betterVerbs): string|null
{
    $first = firstWordOf($declared->name);

    if ($declared->role === 'action' && isset($betterVerbs[$first])) {
        return "its verb {$first}: {$betterVerbs[$first]}";
    }

    return null;
}

/**
 * A thing named for what will be done with it ("step to run") instead of for what it is. An action or a question may
 * hold "to" and a verb, so may a function that starts with its own verb, a participle before "to" names a state
 * (failed to start), an interrogative a noun phrase (how to fix), and a verb no type is named for a verb phrase
 * (reply to message).
 *
 * @param  array<string, true>  $verbs
 * @param  array<string, true>  $nouns
 */
function purposeFault(DeclaredName $declared, array $verbs, array $nouns): string|null
{
    $words = wordsOf($declared->name);
    $first = $words[0] ?? '';
    $isFunction = in_array($declared->declarationType, ['method', 'function'], true);

    if ($declared->role !== 'thing' || in_array($first, QUESTION_WORDS, true) || ($isFunction && isset($verbs[$first]))) {
        return null;
    }

    foreach ($words as $at => $word) {
        $before = $words[$at - 1] ?? '';
        $isState = preg_match('/(ed|ing)$/', $before) === 1;
        $isInterrogative = in_array($before, INTERROGATIVE_WORDS, true);
        // A name that opens with a verb says what it does when no type is named for its verb, or when what follows
        // "to" is a thing the code names a type for and a word naming the carrier comes after it: ReplyToMessageCall.
        // One that ends on that thing names what will be done with it (StepToRun).
        $after = $words[$at + 1] ?? '';
        $hasCarrier = isset($words[$at + 2]);
        $isVerbPhrase = $at === 1 && isset($verbs[$before]) && (! isset($nouns[$before]) || (isset($nouns[$after]) && $hasCarrier));
        // "from a to b" names a mapping between two things (fromRecordToType), not a purpose.
        $isMapping = in_array('from', array_slice($words, 0, $at), true);

        if ($word === 'to' && $at > 0 && ! $isState && ! $isInterrogative && ! $isVerbPhrase && ! $isMapping && isset($words[$at + 1], $verbs[$words[$at + 1]])) {
            return "named for what will be done with it ({$words[$at - 1]} to {$words[$at + 1]}): name what it is, "
                .'a pending, active or waiting one, or its plain noun';
        }
    }

    return null;
}

/**
 * An action class (a step, pipeline, command, listener or job) starts with the verb of what it does, not with a noun
 * the code names a type for (ChatActivityRecorder is RecordChatActivity).
 *
 * @param  array<string, true>  $commandVerbs
 * @param  array<string, true>  $nouns
 * @param  array<string, true>  $sharedVerbs  first words several action classes share, which is a verb's evidence
 */
function actionClassFault(DeclaredName $declared, array $commandVerbs, array $nouns, array $sharedVerbs): string|null
{
    $first = firstWordOf($declared->name);
    $isNoun = ! isset($commandVerbs[$first]) && ! isset($sharedVerbs[$first])
        && (isset($nouns[$first]) || isset($nouns[rtrim($first, 's')]));

    if ($declared->declarationType !== 'class' || $declared->role !== 'action' || ! $isNoun) {
        return null;
    }

    return "an action class starts with its verb, and {$first} is a noun the code names types for";
}

/**
 * The first words two or more action classes start with (CastConstructorValues, CastPropertyValues): a word that
 * several actions open with is their verb.
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function sharedActionWordsOf(array $names): array
{
    $counts = [];

    foreach ($names as $declared) {
        $isInActionFolder = preg_match(ACTION_FOLDERS, $declared->place) === 1 && ! str_ends_with($declared->name, 'Test');

        if ($declared->declarationType === 'class' && $isInActionFolder) {
            $first = firstWordOf($declared->name);
            $counts[$first] = ($counts[$first] ?? 0) + 1;
        }
    }

    return array_fill_keys(array_keys(array_filter($counts, fn (int $count) => $count > 1)), true);
}

/**
 * The nouns of the code: the last word of every type it declares (a PendingStep makes step a noun).
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function nounsOf(array $names): array
{
    $nouns = [];

    foreach ($names as $declared) {
        if (in_array($declared->declarationType, ['class', 'interface', 'enum', 'trait', 'type', 'component'], true)) {
            $words = wordsOf($declared->name);
            $nouns[(string) end($words)] = true;
        }
    }

    return $nouns;
}

/**
 * An event (a class of an event contract) says what happened: a word after its subject is a past form
 * (StopRequested, AccountHeldForMaintenance).
 */
function eventFault(DeclaredName $declared): string|null
{
    $isEvent = $declared->role === 'event';
    $saysWhatHappened = array_any(array_slice(wordsOf($declared->name), 1), fn (string $word) => preg_match(PAST_FORM, $word) === 1);

    if ($isEvent && ! $saysWhatHappened) {
        return 'an event says what happened, and no word of it is a past form';
    }

    return null;
}

/**
 * A state says with the plain verb what the agent is to do (ReadMessageState), never with the gerund
 * (ReadMessageState).
 */
function stateFault(DeclaredName $declared): string|null
{
    $first = firstWordOf($declared->name);

    if ($declared->role === 'state' && str_ends_with($first, 'ing')) {
        return "a state says what the agent is to do with the plain verb, not {$first}";
    }

    if ($declared->declarationType === 'enum' && str_ends_with($declared->name, 'State')) {
        return 'an enum of where something stands is named Status: State names an agent state';
    }

    return null;
}

/**
 * A name that holds a verb and something that happened names the happening as an event is named: the thing first,
 * then its past participle (NotifyReceiptsWithdrawn), never the participle between the verb and the thing
 * (NotifyWithdrawnReceipts). It holds for an acting name whose verb tells someone, or whose thing and participle are
 * an event of the code; a participle that only says which thing (restart changed mounts) stays before it.
 *
 * @param  array<string, true>  $verbs
 * @param  array<string, true>  $nouns
 * @param  array<string, true>  $happenings  the events of the code, as their words joined by spaces
 */
function participleOrderFault(DeclaredName $declared, array $verbs, array $nouns, array $happenings): string|null
{
    $words = wordsOf($declared->name);
    [$verb, $participle] = [
        $words[0] ?? '',
        $words[1] ?? '',
    ];
    // a role word at the end (NotifyStoppedHandler) belongs to the class, not to the happening
    $happenedTo = array_slice($words, 2);

    while ($happenedTo !== [] && in_array(array_last($happenedTo), ROLE_SUFFIXES, true)) {
        array_pop($happenedTo);
    }

    // the happening already stands last (NotifyPipedCommandsRefused, BroadcastDockedSourceChange): the participle
    // before it says which thing; a participle the code names a type for (run), and that no event ends with, is a noun
    $last = (string) array_last($happenedTo);
    $isHappeningLast = isParticiple($last, $verbs) || preg_match('/(tion|sion|ment|ance|ence|ure|change)$/', $last) === 1;

    $endsAnEvent = array_any(array_keys($happenings), fn (string $event) => str_ends_with($event, " {$participle}"));

    if ($happenedTo === [] || $isHappeningLast || (isset($nouns[$participle]) && ! $endsAnEvent)) {
        return null;
    }

    // a participle before its thing says which thing (restart changed mounts) unless the name tells of a happening: its
    // verb tells someone (notify, announce), or the thing with its participle is an event of the code (BookShelved)
    $isAction = $declared->role === 'action' && preg_match('/(^|::)test/i', $declared->name) !== 1;
    $isHappening = in_array($verb, TELLING_VERBS, true) || isset($happenings[implode(' ', [
        ...$happenedTo,
        $participle,
    ])]);

    if (! $isAction || ! isset($verbs[$verb]) || $happenedTo === [] || ! isParticiple($participle, $verbs) || ! $isHappening) {
        return null;
    }

    $reordered = implode(' ', [$verb, ...$happenedTo, $participle]);

    return "names what happened with the participle before its thing ({$verb} {$participle} ".implode(' ', $happenedTo)
        ."): the thing comes first, then what happened to it ({$reordered})";
}

/**
 * The events the code declares, each as its words joined by spaces (book shelved).
 *
 * @param  list<DeclaredName>  $names
 * @return array<string, true>
 */
function happeningsOf(array $names): array
{
    $events = array_filter($names, fn (DeclaredName $declared) => $declared->role === 'event');

    return array_fill_keys(array_map(fn (DeclaredName $declared) => implode(' ', wordsOf($declared->name)), $events), true);
}

/**
 * Whether a word is a verb's past participle: a known verb with -ed (withdrawn and the like are listed), never a word
 * that only ends that way (speed, need).
 *
 * @param  array<string, true>  $verbs
 */
function isParticiple(string $word, array $verbs): bool
{
    $stems = [substr($word, 0, -2), substr($word, 0, -1), substr($word, 0, -3), preg_replace('/ied$/', 'y', $word)];
    $isRegular = str_ends_with($word, 'ed') && array_any($stems, fn (string $stem) => $stem !== '' && isset($verbs[$stem]));

    return $isRegular || in_array($word, IRREGULAR_PARTICIPLES, true);
}

/**
 * A command (a method or function that returns nothing) is imperative: close, not closes.
 *
 * @param  array<string, true>  $verbs
 */
function commandMoodFault(DeclaredName $declared, array $verbs): string|null
{
    $first = firstWordOf($declared->name);
    $isCommand = $declared->role === 'action' && in_array($declared->declarationType, ['method', 'function'], true);
    $stem = in_array($first, QUESTION_WORDS, true) ? null : stemOfThirdPerson($first, $verbs);

    if ($isCommand && $stem !== null) {
        return "a command is imperative: {$stem}, not {$first}";
    }

    return null;
}

/**
 * A yes-or-no answer reads as a question: is, has, can and the like first, or a verb in its third person (allows,
 * contains), which a first word ending in a single s is taken to be. A method that starts with a verb is a command
 * that answers whether it did its work.
 *
 * @param  array<string, true>  $verbs
 */
function questionFault(DeclaredName $declared, array $verbs): string|null
{
    $first = firstWordOf($declared->name);

    $isThirdPerson = stemOfThirdPerson($first, $verbs) !== null || preg_match('/[^s]s$/', $first) === 1;
    // A method that starts with a verb acts and answers whether it did (claim, insertIfMissing): a command, not a question.
    $isCommand = in_array($declared->declarationType, ['method', 'function'], true) && isset($verbs[$first]);
    // boolean() reads a value as a boolean, as string() and integer() read theirs: a typed accessor.
    $isTypedAccessor = $declared->declarationType === 'method' && wordsOf($declared->name) === ['boolean'];

    if ($declared->role !== 'question' || in_array($first, QUESTION_WORDS, true) || $isThirdPerson || $isCommand || $isTypedAccessor) {
        return null;
    }

    return "a yes or no answer reads as a question (is, has, can, or a verb such as allows), and {$first} does not";
}

/**
 * A method that answers is named for its answer, never get first; a name a vendor type gives (a cast's get, an
 * iterator's getIterator) is kept, and so is get alone.
 */
function getterFault(DeclaredName $declared): string|null
{
    $words = wordsOf($declared->name);
    $isFunction = in_array($declared->declarationType, ['method', 'function'], true);

    $isOwnName = $declared->role !== 'override';

    if ($isOwnName && $isFunction && count($words) > 1 && $words[0] === 'get') {
        return 'named for its answer, never get first';
    }

    return null;
}

/**
 * A shell function is a step named verb_noun, or a question (is_archived); main is the script's entry. A first word
 * the code knows as a noun or a past form (schema_changed) and not as a verb is refused.
 *
 * @param  array<string, true>  $verbs
 * @param  array<string, true>  $nouns
 */
function shellFunctionFault(DeclaredName $declared, array $verbs, array $nouns): string|null
{
    $first = firstWordOf($declared->name);
    $isShellFunction = $declared->declarationType === 'function' && str_contains($declared->place, '.sh');
    $isVerb = isset($verbs[$first]) || in_array($first, QUESTION_WORDS, true);
    $isNoun = isset($nouns[$first]) || isset($nouns[rtrim($first, 's')]) || preg_match('/(ed|ing)$/', $first) === 1;

    if (! $isShellFunction || $declared->name === 'main' || $isVerb || ! $isNoun) {
        return null;
    }

    return "a shell function is verb_noun, and {$first} is no verb";
}

/**
 * The verb a word is the third person of (allows of allow, closes of close, carries of carry), or null when it is none.
 *
 * @param  array<string, true>  $verbs
 */
function stemOfThirdPerson(string $word, array $verbs): string|null
{
    $stems = array_filter([
        str_ends_with($word, 'ies') ? substr($word, 0, -3).'y' : null,
        str_ends_with($word, 's') && ! str_ends_with($word, 'ss') ? substr($word, 0, -1) : null,
        str_ends_with($word, 'es') ? substr($word, 0, -2) : null,
    ]);

    foreach ($stems as $stem) {
        if (isset($verbs[$stem])) {
            return $stem;
        }
    }

    return null;
}

function firstWordOf(string $name): string
{
    return wordsOf($name)[0] ?? '';
}

/**
 * The forbidden words, one to a line before a tab and the reason; a line starting with # is a comment, and one starting
 * with verb: names a better word for an action's verb.
 *
 * @return array<string, string> word => the word with why it is forbidden
 */
function forbiddenWords(string $file): array
{
    $words = [];

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (! str_starts_with($line, '#') && ! str_starts_with($line, 'verb:')) {
            [$word, $why] = explode("\t", $line, 2) + [1 => ''];
            $words[strtolower(trim($word))] = trim($word).($why === '' ? '' : " ({$why})");
        }
    }

    return $words;
}

/**
 * The verbs forbidden-words.txt names a better word for, on its lines that start with verb:.
 *
 * @return array<string, string> verb => why, with the better word
 */
function betterVerbs(string $file): array
{
    $verbs = [];

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (str_starts_with($line, 'verb:')) {
            [$verb, $why] = explode("\t", substr($line, strlen('verb:')), 2) + [1 => ''];
            $verbs[strtolower(trim($verb))] = trim($why);
        }
    }

    return $verbs;
}
