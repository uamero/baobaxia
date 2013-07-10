from django.forms import widgets
from rest_framework import serializers
from media.models import Media, FORMAT_CHOICES, TYPE_CHOICES

class MediaSerializer(serializers.Serializer):
    pk = serializers.Field()  # Note: `Field` is an untyped read-only field.
    date = serializers.DateTimeField()
    uuid = serializers.CharField(max_length=36)
    title = serializers.CharField(max_length=100, blank=True, default='')
    comment = serializers.CharField()
    author = serializers.CharField()
    origin = serializers.CharField()
    type = serializers.CharField()
    format = serializers.CharField()
#    type = serializers.CharField(choices=TYPE_CHOICES, default='arquivo')
#    format = serializers.CharField(choices=FORMAT_CHOICES)
    license = serializers.CharField()
#    versions = 
#    tags = 

    def restore_object(self, attrs, instance=None):
        """
        Create or update a new media instance, given a dictionary
        of deserialized field values.

        Note that if we don't define this method, then deserializing
        data will simply return a dictionary of items.
        """
        if instance:
            # Update existing instance
            instance.date = attrs.get('date', instance.date)
            instance.uuid = attrs.get('uuid', instance.uuid)
            instance.title = attrs.get('title', instance.title)
            instance.comment = attrs.get('comment', instance.comment)
            instance.author = attrs.get('author', instance.author)
            instance.origin = attrs.get('origin', instance.origin)
            instance.type = attrs.get('type', instance.type)
            instance.format = attrs.get('format', instance.format)
            instance.license = attrs.get('license', instance.license)

            #    versions = 
            #    tags = 
            return instance

        # Create new instance
        return Media(**attrs)